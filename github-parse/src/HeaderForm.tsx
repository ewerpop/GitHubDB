import { TextField } from "@mui/material"
import style from './App.module.scss'
import { load } from "./features/parser/parserSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Button } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles';
import { useState } from "react";

// Input теперь имеет белый фон 
const useStyles = makeStyles((theme: any) => ({
    root: {
        '& .MuiInputBase-input': {
            backgroundColor: theme.palette.common.white,
            borderRadius: '5px'
        },
    },
}));

interface props {
    handleSubmit: () => void
}

export default function HeaderForm({ handleSubmit }: props) {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const state = useAppSelector((state) => state.parse)

    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [value, setValue] = useState<string>('')
    
    function onSubmit(e: any) {
        e.preventDefault()
        dispatch(load(value))
        console.log(state)
        handleSubmit()
    }

    return (
        <header className={style.header}>
            <nav>
                <form onSubmit={onSubmit}>
                    <ul className={style.horizontalUl}>
                        <li className={style.li}>
                            <TextField InputProps={{
                                className: classes.root,
                            }} InputLabelProps={{
                                shrink: false
                            }} sx={{ width: '900px', paddingRight: '6px' }} value={value} onChange={(e) => setValue(e.target.value)} onFocus={() => setIsFocus(true)} color='secondary' size="small" label={isFocus ? '' : 'Введите поисковый запрос'} type="search" />
                        </li>
                        <li className={style.li}>
                            <Button onClick={(e) => onSubmit(e)} sx={{ height: '39px' }} variant="contained">Поиск</Button>
                        </li>
                    </ul>
                </form>
            </nav>
        </header>
    )
}