/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "../access/roles";

export const Media: CollectionConfig = {
  slug: "media",

  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },

  admin: {
    group: 'Pusat Media',
  },
  fields: [
    {
      name: "alt",
      type: "text",
      // required: true,
    },
    {
      name: "title",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Building", value: "building" },
        { label: "Interior", value: "interior" },
        { label: "Activities", value: "activities" },
        { label: "History", value: "history" },
        { label: "Traditions", value: "traditions" },
        { label: "Other", value: "other" },
      ],
    },
  ],

  upload: {
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
};
