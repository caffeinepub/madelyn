# Specification

## Summary
**Goal:** Add support for a new “Girl Scout tins” collection category so users can create, browse, and view tin items alongside existing books, patches, and uniforms.

**Planned changes:**
- Extend the backend item category model to include a new Tin category while keeping existing list and filter APIs working as before.
- Update frontend category tabs to include a new “Tins” section and ensure All Items includes tin items with category labeling.
- Update frontend data querying/state to fetch tin items with proper loading/error handling and include tins in search filtering.
- Update the Add Item form and item card/details rendering to allow selecting “Tin” and display tin items with appropriate labels and distinct category styling.

**User-visible outcome:** Users can add tin items, view them under a new Tins tab, and see tins included in All Items with proper category labels and search support.
