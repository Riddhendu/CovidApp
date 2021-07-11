import React from 'react';
import {Line} from 'react-chartjs-2'
function lineGraph(props) {
    return (
        <div style={{width:'600px',height:"600px",margin:"50px auto"}}>
            <Line data={{
  labels:props.label,
  datasets: [
    {
      label: 'My first dataset',
      data:props.yAxis,
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
      
    },
  ],
}}/>
        </div>
    );
}

export default lineGraph;