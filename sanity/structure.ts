import type { StructureResolver } from "sanity/structure";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Garage Sale")
        .id("garage-sale")
        .child(
          S.list()
            .title("Garage Sale")
            .items([S.documentTypeListItem("part").title("Parts")]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== "part"),
    ]);
