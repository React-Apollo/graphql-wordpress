import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Checkbox from 'components/Field/Checkbox';
import { Table, StripedRow, CellHeading, Cell, CheckboxCell } from 'styles/utils';
import { Heading, Filters, Pagination } from './styled';

/* eslint-disable react/prop-types */

const PER_PAGE = 10;

export default function ListTable({
  location,
  match: { params },
  data,
  path,
  title,
  columns,
  filters,
}) {
  const LinkTo = ({ to = '', children }) => (
    <Link to={{ pathname: `${path}${to}`, search: location.search }}>{children}</Link>
  );

  const headers = (
    <tr>
      <CheckboxCell>
        <Checkbox name="all" />
      </CheckboxCell>
      {columns.map(column => <CellHeading key={column.label}>{column.label}</CellHeading>)}
    </tr>
  );

  const pages = data.count > 0 ? Math.ceil(data.count / PER_PAGE) : 0;
  const firstPage = pages === 0 ? 0 : 1;
  const currentPage = params.page ? parseInt(params.page, 10) : firstPage;
  const paginated = currentPage && currentPage > 1;
  let previousUrl = null;
  let nextUrl = null;
  if (paginated) {
    if (currentPage - 1 > 1) {
      previousUrl = `/page/${currentPage - 1}`;
    } else {
      previousUrl = '';
    }
  }
  if (currentPage !== pages && data.pageInfo.hasNextPage) {
    nextUrl = `/page/${currentPage + 1}`;
  }

  const paginationMatrix = (
    <Pagination>
      <strong>{data.count} items</strong>
      {paginated ? <LinkTo>«</LinkTo> : <span>«</span>}
      {previousUrl === null ? <span>‹</span> : <LinkTo to={previousUrl}>‹</LinkTo>}
      <strong>
        {paginated ? currentPage : firstPage} of {pages}
      </strong>
      {nextUrl === null ? <span>›</span> : <LinkTo to={nextUrl}>›</LinkTo>}
      {currentPage !== pages ? <LinkTo to={`/page/${pages}`}>»</LinkTo> : <span>»</span>}
    </Pagination>
  );

  return (
    <Fragment>
      <Heading>{title}</Heading>
      <Filters>
        {filters}
        {paginationMatrix}
      </Filters>
      <Table>
        <thead>{headers}</thead>
        <tbody>
          {data.edges.map(({ node }) => (
            <StripedRow key={node.id}>
              <CheckboxCell>
                <Checkbox name="deleteme" />
              </CheckboxCell>
              {columns.map(column => (
                <Cell key={column.label}>
                  {column.render ? column.render(node) : node[column.prop]}
                </Cell>
              ))}
            </StripedRow>
          ))}
        </tbody>
        <tfoot>{headers}</tfoot>
      </Table>
      <Filters>{paginationMatrix}</Filters>
    </Fragment>
  );
}