import "./Table.scss";

import React, { useState } from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<T>(
  order: Order,
  orderBy?: keyof T
): ((a: T, b: T) => number) | undefined {
  if (!orderBy) return undefined;
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator?: (a: T, b: T) => number): T[] {
  if (!comparator) return array;
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export interface HeadCell<T> {
  id: keyof T;
  label: string;
}

export interface EnhancedTableHeadProps<T> {
  headCells: HeadCell<T>[];
  onRequestSort: (property: keyof T) => void;
  order: Order;
  orderBy?: keyof T;
}

function EnhancedTableHead<T>({
  headCells,
  onRequestSort,
  order,
  orderBy,
}: EnhancedTableHeadProps<T>): React.ReactElement {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id as string}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={(_event) => onRequestSort(headCell.id)}
              className="tableSortLabel"
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export interface EnhancedTableProps<T> {
  headCells: HeadCell<T>[];
  data: T[];
  onClick?: (row: T) => void;
}

const ROWS_PER_PAGE = 5;
export default function EnhancedTable<T extends { [key: string]: unknown }>({
  headCells,
  data,
  onClick,
}: EnhancedTableProps<T>): React.ReactElement {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof T | undefined>(undefined);
  const [page, setPage] = useState(0);

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="TableContainer">
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          size={"medium"}
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
          />
          <TableBody>
            {stableSort<T>(data, getComparator<T>(order, orderBy))
              .slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    className="tableRow"
                    onClick={(_event) => (onClick ? onClick(row) : null)}
                    tabIndex={-1}
                    key={index}
                  >
                    {headCells
                      .map((header) => row[header.id])
                      .map((value, index) => {
                        return (
                          <TableCell key={index} className="tableCell">
                            {value as string | number}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[ROWS_PER_PAGE]}
        component="div"
        count={data.length}
        rowsPerPage={ROWS_PER_PAGE}
        page={page}
        onChangePage={(_e, newPage) => handleChangePage(newPage)}
      />
    </div>
  );
}
