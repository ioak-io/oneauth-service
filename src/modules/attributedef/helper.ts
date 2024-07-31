const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { getCollection } from "../../lib/dbutils_new";
import { attributedefCollection, attributedefSchema } from "./model";

export const updateAttributedef = async (
  space: string,
  data: any[],
  userId?: string
) => {
  const model = getCollection(
    space,
    attributedefCollection,
    attributedefSchema
  );
  let response = null;

  const allRecords = await model.find();

  const responseList = [];
  const idList: string[] = [];
  for (let i = 0; i < data.length; i++) {
    const response = await updateAttributedefItem(space, data[i], allRecords);
    responseList.push(response);
    idList.push(response._id);
  }
  await model.deleteMany({ _id: { $nin: idList } });

  return await model.find().sort({ group: "ascending", name: "ascending" });
};

const updateAttributedefItem = async (
  space: string,
  data: any,
  allRecords: any[]
) => {
  const model = getCollection(
    space,
    attributedefCollection,
    attributedefSchema
  );
  let response = null;
  if (data._id) {
    response = await model.findByIdAndUpdate(
      data._id,
      {
        ...data,
        linkable: data.linkable && data.type === "short-text",
      },
      { new: true, upsert: true }
    );
  } else {
    response = await model.create({
      ...data,
      linkable: data.linkable && data.type === "short-text",
    });
  }
  return response;
};

export const getAttributedef = async (space: string) => {
  const model = getCollection(
    space,
    attributedefCollection,
    attributedefSchema
  );

  return await model.find().sort({ group: "ascending", name: "ascending" });
};

export const deleteAttributedef = async (space: string, _id: string) => {
  const model = getCollection(
    space,
    attributedefCollection,
    attributedefSchema
  );

  await model.remove({ _id });
  return { attributedef: [_id] };
};
