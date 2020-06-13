import { ParsedUrlQuery } from "querystring";
import { getAsString } from "@/utils/getAsString";
import { openDB } from "src/openDB";
import { CarModel } from "@/models/Car";

const mainQuery = `
    FROM car
    WHERE (@make is NULL OR @make = make)
    AND (@model is NULL OR @model = model)
    AND (@minPrice is NULL OR @minPrice <= price)
    AND (@maxPrice is NULL OR @maxPrice >= price)
`;

function getValueNumber(value: string | string[]) {
  const str = getValueStr(value);
  if (!str) return null;
  return parseInt(str);
}

function getValueStr(value: string | string[]) {
  const str = getAsString(value);
  return !str || str.toLowerCase() === "all" ? null : str;
}

export async function getPaginatedCars(query: ParsedUrlQuery) {
  const db = await openDB();

  const page = getValueNumber(query.page) || 1;
  const rowsPerPage = getValueNumber(query.rowsPerPage) || 4;
  const offset = (page - 1) * rowsPerPage === 0 ? 0 : 5;

  const dbParams = {
    "@make": getValueStr(query.make),
    "@model": getValueStr(query.model),
    "@minPrice": getValueNumber(query.minPrice),
    "@maxPrice": getValueNumber(query.maxPrice),
  };

  const carsPromise = db.all<CarModel[]>(
    `SELECT * ${mainQuery} LIMIT @rowsPerPage OFFSET @offset`,
    {
      ...dbParams,
      "@rowsPerPage": rowsPerPage,
      "@offset": offset,
    }
  );

  const totalRowsPromise = db.get<{ count: number }>(
    `SELECT COUNT(*) as count ${mainQuery}`,
    dbParams
  );

  const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);

  return { cars, totalPages: Math.ceil((totalRows?.count || 0) / rowsPerPage) };
}
