import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Category = {
    #Book : {
      year : Nat;
      name : Text;
    };
    #Patch;
    #Uniform;
    #Tin;
  };

  type Item = {
    id : Text;
    category : Category;
    photo : ?Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  module Item {
    public func compareByKey(item1 : Item, item2 : Item) : Order.Order {
      switch (Text.compare(item1.id, item2.id)) {
        case (#equal) { compareByCategory(item1.category, item2.category) };
        case (order) { order };
      };
    };

    public func compareByYear(item1 : Item, item2 : Item) : Order.Order {
      switch (item1.category, item2.category) {
        case (#Book { year = year1 }, #Book { year = year2 }) {
          if (year1 < year2) { #less } else if (year1 > year2) {
            #greater;
          } else {
            Text.compare(item1.id, item2.id);
          };
        };
        case (#Book _, _) { #less };
        case (_, #Book _) { #greater };
        case (_, _) { Text.compare(item1.id, item2.id) };
      };
    };

    public func compareByCategory(category1 : Category, category2 : Category) : Order.Order {
      switch (category1, category2) {
        case (#Book _, #Book _) { #equal };
        case (#Book _, _) { #less };
        case (_, #Book _) { #greater };
        case (#Patch, #Patch) { #equal };
        case (#Patch, _) { #less };
        case (_, #Patch) { #greater };
        case (#Uniform, #Uniform) { #equal };
        case (#Uniform, _) { #less };
        case (_, #Uniform) { #greater };
        case (#Tin, #Tin) { #equal };
      };
    };
  };

  let items = Map.empty<Text, Item>();

  public query ({ caller }) func getItem(id : Text) : async Item {
    switch (items.get(id)) {
      case (?item) { item };
      case (null) { Runtime.trap("Item not found") };
    };
  };

  public query ({ caller }) func listItems() : async [Item] {
    items.values().toArray().sort(Item.compareByKey);
  };

  public query ({ caller }) func filterByCategory(category : Category) : async [Item] {
    items.values().toArray().filter(
      func(item) {
        switch (category, item.category) {
          case (#Book _, #Book _) { true };
          case (#Patch, #Patch) { true };
          case (#Uniform, #Uniform) { true };
          case (#Tin, #Tin) { true };
          case (_, _) { false };
        };
      }
    );
  };

  public query ({ caller }) func sortBooksByYear() : async [Item] {
    items.values().toArray().sort(Item.compareByYear);
  };

  public shared ({ caller }) func addItem(id : Text, category : Category, photo : ?Storage.ExternalBlob) : async () {
    let item : Item = {
      id;
      category;
      photo;
      timestamp = Time.now();
    };
    items.add(id, item);
  };
};
