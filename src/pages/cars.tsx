import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { getAsString } from "@/utils/getAsString";
import Search from ".";

// Material UI
import { PaginationRenderItemParams } from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkProps) {
  return (
    <Link href={{ pathname: "/cars", query: { ...query, page: item.page } }}>
      <a {...props}></a>
    </Link>
  );
}

export default function CarsList({ makes, models, cars, totalPages }: CarsListProps) {
  const { query } = useRouter();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>

      <Grid item xs={12} sm={7} md={9}>
        <pre style={{ fontSize: "3rem" }}>
          <Pagination
            page={parseInt(getAsString(query.page) || "1")}
            count={totalPages}
            renderItem={(item) => (
              <PaginationItem component={MaterialUiLink} query={query} item={item} {...item} />
            )}
          />

          {JSON.stringify({ totalPages, cars }, null, 4)}
        </pre>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);

  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);

  return { props: { makes, models, cars: pagination.cars, totalPages: pagination.totalPages } };
};
