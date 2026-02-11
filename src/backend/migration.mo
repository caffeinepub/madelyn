import Map "mo:core/Map";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";

module {
  type OldCategory = {
    #Book : {
      year : Nat;
      name : Text;
    };
    #Patch;
    #Uniform;
  };

  type OldItem = {
    id : Text;
    category : OldCategory;
    photo : ?Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  type OldActor = {
    items : Map.Map<Text, OldItem>;
  };

  type NewCategory = {
    #Book : {
      year : Nat;
      name : Text;
    };
    #Patch;
    #Uniform;
    #Tin;
  };

  type NewItem = {
    id : Text;
    category : NewCategory;
    photo : ?Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  type NewActor = {
    items : Map.Map<Text, NewItem>;
  };

  public func run(old : OldActor) : NewActor {
    let newItems = old.items.map<Text, OldItem, NewItem>(
      func(_id, oldItem) {
        { oldItem with category = migrateCategory(oldItem.category) };
      }
    );
    { items = newItems };
  };

  func migrateCategory(old : OldCategory) : NewCategory {
    switch (old) {
      case (#Book book) { #Book(book) };
      case (#Patch) { #Patch };
      case (#Uniform) { #Uniform };
    };
  };
};
