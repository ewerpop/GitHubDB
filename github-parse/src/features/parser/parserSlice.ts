import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import axios from 'axios'
import { SEARCH_REPO, ADD_REPO } from './queries'
import { createAsyncThunk } from '@reduxjs/toolkit'
import shortid from 'shortid'

// !!! Обязательно вставьте на место YOUR_API_KEY свой ключ из GitHub !!!
const headers = {
    Authorization: `Bearer YOUR_API_KEY`, // должно быть как то так: `Bearer adf0a9ds09fb9adejf`
};

//Интерфейс для языка, в массиве languages
export interface node {
    name: string,
    color: string
}
export interface languages {
    nodes: Array<node>
}
export interface license {
    name: string
}
//В таком виде данные приходят
export interface parserStateElement {
    name: string,
    primaryLanguage: {
        name: string | null
    },
    forkCount: number,
    stargazers: {
        totalCount: number
    },
    updatedAt: string,
    languages: languages | null,
    licenseInfo: license | null
}
//Эти данные отрисуются в таблице
export interface tableElements {
    name: string,
    primaryLanguage: {
        name: string | null
    },
    forkCount: number,
    stargazers: {
        totalCount: number
    },
    updatedAt: string,
}
//Значение по-умолчанию и загрузка
const initialStateElement: parserStateElement = {
    name: 'Loading..',
    primaryLanguage: {
        name: 'Loading...'
    },
    forkCount: 8,
    stargazers: {
        totalCount: 8
    },
    updatedAt: 'Loading...',
    languages: {
        nodes: [
            {
                name: 'Loading',
                color: '#00ff00'
            }
        ]
    },
    licenseInfo: {
        name: "Loading..."
    }
}

const initialState = { nodes: [
    initialStateElement
]}

let queryVar: string
let hasNextPage: boolean
let after: string 


export const load = createAsyncThunk('parser/load', async (query: string) => {
    queryVar = query
    const response = await axios.post('https://api.github.com/graphql', { query: SEARCH_REPO, variables: { query } }, { headers })
    hasNextPage = response.data.data.search.pageInfo.hasNextPage

    if (hasNextPage) {
        after = response.data.data.search.pageInfo.endCursor
    } 

    return response.data.data.search.nodes.map((e: parserStateElement) => {
        return {...e, id: shortid.generate()}
    })
})

//Функция автоматической подгрузки для пагинации
export const add = createAsyncThunk('parser/add', async () => {
    if (hasNextPage) {
        const response = await axios.post('https://api.github.com/graphql', {query: ADD_REPO, variables: {query: queryVar, after: after}}, {headers})
        hasNextPage = response.data.data.search.pageInfo.hasNextPage  
        if (hasNextPage) after = response.data.data.search.pageInfo.endCursor
        return response.data.data.search.nodes.map((e: parserStateElement) => {
            return {...e, id: shortid.generate()}
        })
    } else {
        return []
    }
})
export const parseSlice = createSlice({
    name: 'parser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(load.fulfilled, (state, action) => {
                state.nodes = action.payload
            })
            .addCase(add.fulfilled, (state, action) => {
                if (action.payload) {
                    state.nodes = [...state.nodes, ...action.payload]
                }
            })
    },
})

export const currentState = (state: RootState) => state.parse
export default parseSlice.reducer