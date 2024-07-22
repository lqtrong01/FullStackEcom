import React from "react";
import {GridComponent} from "@syncfusion/ej2-react-grids"
const DataGridComponent = (data) => {
    
    return (
        <>
        <GridComponent dataSource={data}/>
        </>
    )
}

export default DataGridComponent;