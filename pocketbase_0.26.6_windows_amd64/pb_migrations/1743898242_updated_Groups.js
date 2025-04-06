/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3235004680")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2768340402",
    "hidden": false,
    "id": "relation3936885324",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "transactions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3235004680")

  // remove field
  collection.fields.removeById("relation3936885324")

  return app.save(collection)
})
