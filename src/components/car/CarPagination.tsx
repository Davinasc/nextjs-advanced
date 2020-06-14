import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef } from "react";
import { ParsedUrlQuery } from "querystring";
import { getAsString } from "@/utils/getAsString";

// Material UI
import { PaginationRenderItemParams } from "@material-ui/lab";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

const MaterialUiLink = forwardRef<HTMLAnchorElement, MaterialUiLinkProps>(
  ({ item, query, ...props }, ref) => (
    <Link href={{ pathname: "/cars", query: { ...query, page: item.page } }} shallow>
      <a {...props} ref={ref}></a>
    </Link>
  )
);

export function CarPagination({ totalPages }: { totalPages: number }) {
  const { query } = useRouter();

  return (
    <Pagination
      page={parseInt(getAsString(query.page || "1"))}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem component={MaterialUiLink} query={query} item={item} {...item} />
      )}
    />
  );
}
