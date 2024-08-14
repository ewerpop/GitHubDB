import style from './App.module.scss'
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import type { parserStateElement, license, languages, tableElements, node } from './features/parser/parserSlice'
import RepoChooseWait from './RepoChooseWait';
import RepoChoose from './RepoChoose';
import { TableSortLabel } from '@mui/material';
import { add } from './features/parser/parserSlice';


// Интерфейс для заголовка, тут указаны все возможные их вариации (id)
interface Column {
    id: 'name' | 'primaryLanguage' | 'forkCount' | 'stargazers' | 'updatedAt';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: (value: number) => string;
}

type Order = 'asc' | 'desc';

const columns: readonly Column[] = [
    { id: 'name', label: 'Название репозитория', minWidth: 170, align: 'left', },
    { id: 'primaryLanguage', label: 'Язык', minWidth: 100, align: 'left', },
    {
        id: 'forkCount',
        label: 'Число форков',
        minWidth: 170,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'stargazers',
        label: 'Число звёзд',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'updatedAt',
        label: 'Дата обновления',
        minWidth: 170,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
];

interface language {
    name: string | null
}
//Интерфейс для данных, которые будут отображаться в боковом окне
export interface RepoDetails {
    name: string;
    primaryLanguage: language | null;
    stargazers: number;
    licenseInfo: license | null;
    languages: Array<node> | undefined
}

export default function StickyHeadTable() {
    const dispatch = useAppDispatch()
    const state = useAppSelector((state) => state.parse.nodes)
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<any>('name');
    const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null)

    const handleSortRequest = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        //На всякий случай добавил ограничение на количество элементов
        if (state.length <= 800) {
            if (newPage == Math.ceil(state.length / rowsPerPage) - 2) {
                dispatch(add())
            }
        }
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //Функция сортировки, useMemo использовал для оптимизации, так как функция очень дорогая
    const sortedState = useMemo(() => {
        if (!orderBy) {
            return state;
        }

        return [...state].sort((a: any, b: any) => {
            let aValue
            let bValue
            if (orderBy === 'primaryLanguage') {
                if (a[orderBy] == null) {
                    aValue = 'a'
                } else {
                    aValue = a[orderBy].name
                }
                if (b[orderBy] == null) {
                    bValue = 'a'
                } else {
                    bValue = b[orderBy].name
                }
            } else if (orderBy === 'stargazers') {
                aValue = a[orderBy].totalCount
                bValue = b[orderBy].totalCount
            } else {
                aValue = a[orderBy];
                bValue = b[orderBy];
            }

            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [state, orderBy, order, rowsPerPage, page]);


    const handleClick = (repoDetails: RepoDetails) => {
        setRepoDetails(repoDetails)
    }

    return (
        <main className={style.main} style={{ justifyContent: 'space-between' }}>
            <ul>
                <h1 className={style.headText}>Результаты поиска</h1>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                            sortDirection={orderBy === column.id ? order : false}
                                        >
                                            <TableSortLabel
                                                key={column.id}
                                                active={orderBy === column.id}
                                                direction={orderBy === column.id ? order : 'asc'}
                                                onClick={() => handleSortRequest(column.id)}
                                            >
                                                {column.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedState
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage)
                                    .map((row: any) => {
                                        return (
                                            <TableRow onClick={() => handleClick({
                                                name: row.name,
                                                primaryLanguage: row.primaryLanguage,
                                                licenseInfo: row.licenseInfo, stargazers: row.stargazers.totalCount,
                                                languages: row.languages?.nodes
                                            })} hover role="checkbox" tabIndex={-1} key={row.id}>
                                                {columns.map((column) => {
                                                    if (column.id === 'updatedAt') {
                                                        const value = row[column.id].slice(0, 10)
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {value !== undefined && column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        )
                                                    } else {
                                                        let value
                                                        if (column.id == 'stargazers') {
                                                            value = row['stargazers'].totalCount
                                                        } else if (column.id == 'primaryLanguage') {
                                                            if (row['primaryLanguage'] == null) {
                                                                value = ' '
                                                            } else {
                                                                value = row['primaryLanguage'].name
                                                            }
                                                        } else {
                                                            value = row[column.id]
                                                        }
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {value !== undefined && column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    }
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={state.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </ul>
            <div className={style.about}>
                {repoDetails ? <RepoChoose details={repoDetails} /> : <RepoChooseWait />}
            </div>
        </main>
    );
}
