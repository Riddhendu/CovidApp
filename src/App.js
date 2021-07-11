
import React, { useEffect,useState } from 'react';
import './App.css';

import LineGraph from './components/LineGraph';
import CovidSummary from './components/CovidSummary';
import axios from "./axios"

function App() {

  const [totalConfirmed,setTotalConfirmed] = useState(0)
  const [totalRecovered,setTotalRecovered] = useState(0)
  const [totalDeaths,setTotalDeaths] = useState(0)
  const[loading,setLoading]=useState(false)
  const [covidsummary,setCovidSummary] = useState({})
  const [days,setDays] = useState(7)
  const [country,setCountry] = useState('')
  const [coronaCountAr,setCoronaCountAr] = useState([])
  const [label,setLabel]= useState([])
        // componentDidmount//
   useEffect(()=>{
     setLoading(true)
     axios.get(`/summary`).then((res)=>{
       setLoading(false)
       if(res.status ===200){
         setTotalConfirmed(res.data.Global.TotalConfirmed)
         setTotalRecovered(res.data.Global.TotalRecovered)
         setTotalDeaths(res.data.Global.TotalDeaths)
         setCovidSummary(res.data)
       }
       console.log('res====>',res);

     }).catch((error)=>{
       console.log(error);
     })
   },[])
    const formDate = (date)=>{
       const d = new Date(date)
       // 05.12.2021//
       const year = d.getFullYear()
       const month = `0${d.getMonth() + 1}`.slice(-2)
       const _date = d.getDate()

      return `${year}-${month}-${_date}`

    }

   const countryHandeler =(e)=>{
     setCountry(e.target.value)
     const d = new Date()
     const to = formDate(d)
     const from = formDate(d.setDate(d.getDate()-days))
    //  console.log(from,to);
     coronaReportByDate(e.target.value,from,to)

   }
   const daysHandeler =(e)=>{
     setDays(e.target.value)
     const d = new Date()
     const to = formDate(d)
     const from = formDate(d.setDate(d.getDate()-e.target.value))
     coronaReportByDate(country,from,to)
   }
    
   const coronaReportByDate =(countrySlug,from,to)=>{
     axios.get(`/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`).then((res)=>{
       console.log("res---->",res);

       const yAxisCoronaCases = res.data.map(d=> d.Cases)
       const xAxisLebel = res.data.map(d=>d.Date)
       const covidDetails=covidsummary.Countries.find(country => country.Slug === countrySlug)
       setCoronaCountAr(yAxisCoronaCases)
       setTotalConfirmed(covidDetails.TotalConfirmed)
       setTotalRecovered(covidDetails.TotalRecovered)
       setTotalDeaths(covidDetails.TotalDeaths)
       setLabel(xAxisLebel)
     }).catch((error)=>{
       console.log(error);
     })

   }
   if(loading){
     return <p>Fetch api from server</p>
   }
  return (
    <div className="App">
      <CovidSummary
      totalConfirmed={totalConfirmed}
      totalRecovered={totalRecovered}
      totalDeaths={totalDeaths}
      country={country}
      />
      <div>
        <select value={country} onChange={countryHandeler}>
          <option value="">Select Country</option>
          {
            covidsummary.Countries && covidsummary.Countries.map(data=>
                   <option key ={data.Slug} value ={data.Slug}>{data.Country}</option>
            )
          }
        </select>
        <select value={days} onChange={daysHandeler}>
          <option value="7">Last 7 days data</option>
          <option value="30">Last 30 days data</option>
          <option value="90">Last 90 days data</option>
        </select>
      </div>
      <LineGraph
      yAxis={coronaCountAr}
      label={label}/>
    </div>
  );
}

export default App;
