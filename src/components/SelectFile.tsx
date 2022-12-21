import { useState } from 'react';
import readXlsxFile from 'read-excel-file'
import columns from '../columns'

import Loader from './Loader';

const map:any = {}
columns.map((row: any)=> {
    map[row.field]=row.field
})

const SelectFile = ({onFileLoad, setFileName}: any) => {
    const [fileLoaded, setFileLoaded] = useState(false);

    const handleChange = (e: any) => {
        setFileLoaded(true)
        readXlsxFile(e.target.files[0], {map}).then(({rows}) => {
            console.log(rows)
            setFileName(e.target.files[0].name)
            if (onFileLoad) onFileLoad(rows.map((row: any)=>{
                if (row.metaphor) {
                    row.metaphor.split("\n\n").map((old: string, id: number)=>{
                        row[`metaphor_${id+1}`]= old
                    })
                    row.metaphor = ""
                }
                return row
            }))
        })
    }
    return (
        <div style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center'}}>
            {fileLoaded? <Loader />:
            <input type="file" onChange={handleChange} />
            }
        </div>
    );
}
 
export default SelectFile;