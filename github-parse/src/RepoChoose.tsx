import { RepoDetails } from "./MainContent"
import style from './App.module.scss'
import StarIcon from '@mui/icons-material/Star';
import Chip from '@mui/material/Chip';

interface props {
    details: RepoDetails | null
}

export default function RepoChoose({ details }: props) {
    return (
        <>
            <h1 className={style.headText}>
                {details?.name}
            </h1>
            <ul className={style.horizontalUl} style={{paddingLeft: '25px'}}>
                <li className={style.liLeft} style={{width: '50%'}}>
                    <Chip color="info" size="medium" label={details?.primaryLanguage?.name ? details?.primaryLanguage.name : 'Null'} />
                </li>
                <li>
                    <ul className={style.horizontalUl}>
                        <li className={style.li} >
                            <StarIcon style={{ color: 'yellow' }} />
                        </li>
                        <li className={style.li}>
                            <p>{details?.stargazers}</p>
                        </li>
                    </ul>
                </li>
            </ul>
            <ul className={style.horizontalUlTabs} style={{paddingLeft: '25px'}}    >
                {details?.languages?.map((e) => {
                    return (
                        <Chip key={e.name} size="small" label={e.name} style={{marginRight: '8px'}}/>
                    )
                })}
            </ul>
            {details?.licenseInfo?.name ? <p className={style.headText}>{details?.licenseInfo?.name}</p> : <p className={style.headText}>No license</p>}
            
        </>

    )
}