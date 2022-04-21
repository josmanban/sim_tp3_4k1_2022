import {useState, useEffect} from 'react';
import { PruebaChiCuadrado } from '../services/PruebaChiCuadrado';
import { Uniforme, Exponencial, NormalBoxMuller, NormalConvolucion,Poisson } from '../services/Generadores';
import { Bar } from 'react-chartjs-2';

const TP3 = () => {
    const [k,setK] = useState(10);
    const [n,setN] = useState(0);
    const [muestra,setMuestra] = useState([]);

    const [chiInstance, setChiInstance] = useState();
    const [rows,setRows] = useState([]);
    const [chartData, setChartData] = useState({});


    const [generatorType, setGeneratorType] = useState(1);

    const [a, setA] = useState();
    const [b, setB] = useState();
    const [media, setMedia] = useState();
    const [desviacion, setDesviacion] = useState();
    const [lambda, setLambda] = useState();

    const [generadorInstance, setGeneradorInstance] = useState(null);

    const generarMuestra = () => {
        const aux = [];        
        if(generadorInstance){
            if(generatorType===3){
                for( let i= 0;i<n;i=i+2){
                    const [r1,r2] = generadorInstance.calcularRandom();    
                    aux.push(r1);
                    aux.push(r2)
                }
            }else{
                for( let i= 0;i<n;i++){
                    const randomNumber = generadorInstance.calcularRandom();    
                    aux.push(randomNumber);
                }
            }
        }
        return aux;
    };

    useEffect(()=>{
        setN(0);
        setChiInstance(null);
        switch(generatorType) {
            case 1:
                if(a && b){
                    setGeneradorInstance(new Uniforme(a,b,k));
                } else {
                    setGeneradorInstance(null);
                }
                break;
            case 2:
                if(lambda) {
                    setGeneradorInstance(new Exponencial(lambda,k));                
                } else {
                    setGeneradorInstance(null);
                }
                break;
            case 3:
                if(media && desviacion) {
                setGeneradorInstance(new NormalBoxMuller(media,desviacion,k));
                } else {
                    setGeneradorInstance(null);
                }
                break;
            case 4:
                if(lambda) {
                    setGeneradorInstance(new Poisson(lambda,k));
                } else {
                    setGeneradorInstance(null);
                }
                break;
            case 5:
                if(media && desviacion) {
                    setGeneradorInstance(new NormalConvolucion(
                        media,desviacion,k));
                } else {
                    setGeneradorInstance(null);
                }
                break;
            default:
                setGeneradorInstance(null);
        }           
    },[generatorType,a,b,media,desviacion,lambda]);

    useEffect(()=>{
        const chi = new PruebaChiCuadrado(k,muestra,generadorInstance);
        chi.calcularChiCuadrado();
        setChiInstance(chi);
    },[muestra,k]);

    useEffect(()=>{        
        setMuestra(generarMuestra(n));        
    }, [n]);   

    useEffect(()=>{
        if(chiInstance){
            setRows(chiInstance.data);
        }
    },[chiInstance]);

    useEffect(()=>{
        const auxChartData = {
            labels:[],
            datasets:[
                {
                    label:'FO',
                    data:[],
                    backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',                    
                    ],
                    borderColor: [
                    'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                },
                {
                    label:'FE',
                    data:[],
                    backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',                    
                    ],
                    borderColor: [
                    'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                }],
        };
        rows.forEach(row=>{
            auxChartData.labels.push(row.mc);
            auxChartData.datasets[0].data.push(row.fo);
            auxChartData.datasets[1].data.push(row.fe);
        });
        setChartData(auxChartData);
    },[rows]);

    return (
    <>
    <h1>TRABAJO PRÁCTICO N#3</h1>
    <div 
        style={{
            width:'48%',
            display:'inline-block',
            verticalAlign:'top',
            textAlign:'right',
    }}>
        <div>
            <label>K:</label>
            <input 
                type='number' 
                value={k}
                onChange={(e)=>{
                    setK(Number.parseInt(e.target.value));
                }}
                />
        </div>
        <div>
            <label>N:</label>
            <input 
                type='number' 
                value={n}
                onChange={(e)=>{
                    setN(Number.parseInt(e.target.value));
                }}
            />
        </div>
    </div>
    <div 
        style={{
            width:'50%',
            display:'inline-block',
            verticalAlign:'top',
            textAlign:'left',
            marginLeft:'1em',
    }}>
        <label>Tipo Generador:</label>
        <select
            onChange={ e => {
                setGeneratorType(Number.parseInt(e.target.value));
            }}
            > 
            <option value='1'>UNIFORME</option>
            <option value='2'>EXPONENCIAL</option>
            <option value='3'>NORMAL (Box-Muller)</option>
            <option value='5'>NORMAL (Convolución)</option>
            <option value='4'>POISSON</option>
        </select>
        
        { generatorType === 1 &&
            <>
                <div>
                    <label>A:</label>
                    <input 
                        type='number' 
                        value={a}
                        onChange={(e)=>{
                            setA(Number.parseInt(e.target.value));
                        }}
                        />
                </div>
                <div>
                    <label>B:</label>
                    <input 
                        type='number' 
                        value={b}
                        onChange={(e)=>{
                            setB(Number.parseInt(e.target.value));
                        }}
                        />
                </div>
            </>
        }
        { (generatorType === 3 || generatorType === 5) &&
            <>
                <div>
                    <label>µ:</label>
                    <input 
                        type='number' 
                        value={media}
                        onChange={(e)=>{
                            setMedia(Number.parseInt(e.target.value));
                        }}
                        />
                </div>
                <div>
                    <label>δ:</label>
                    <input 
                        type='number' 
                        value={desviacion}
                        onChange={(e)=>{
                            const aux = Number.parseFloat(e.target.value)
                            setDesviacion(aux);
                        }}
                        />
                </div>
            </>
        }
        { (generatorType === 2 || generatorType === 4) &&
            <>
                <div>
                    <label>λ:</label>
                    <input 
                        type='number' 
                        value={lambda}
                        onChange={(e)=>{
                            setLambda(Number.parseInt(e.target.value));
                        }}
                        />
                </div>                
            </>
        }
        { generadorInstance &&
            <>
                <div>
                    <label>GRADOS DE LIBERTAD (v):</label>
                    <input 
                        type='number'
                        disabled={true}
                        value={generadorInstance.getGradosLibertad()}                        
                        />
                </div>
            </>
        }              
                    
        
    </div>
    
    <div>
        <div style={{
            width:'48%',
            display:'inline-block',
            verticalAlign:'top'
        }}>
            <h2>Muestra</h2>
            <table>
                <thead>
                    <th>i</th>
                    <th>Xi</th>
                </thead>
                <tbody>
                {muestra.map( (item,i) => (
                    <tr>
                        <td>{i+1}</td><td>{item}</td>
                    </tr>))}
                </tbody>
            </table>
        </div>
        <div style={{
            width:'50%',
            display:'inline-block',
            marginLeft:'1em',
        }}>
        <table>
            <thead>
                <th>i</th>
                <th>Min</th>
                <th>Max</th>
                <th>MC</th>
                <th>FO</th>
                <th>FE</th>
                <th>FO-FE</th>
                <th>(FO-FE)^2</th>
                <th>(FO-FE)^2/FE</th>
                <th>C = Σ (FO-FE)^2/FE </th>
            </thead>
            <tbody>
                {rows.map((row,i)=>(<tr>
                    <td>{i+1}</td>
                    <td>{row.min}</td>
                    <td>{row.max}</td>
                    <td>{row.mc}</td>
                    <td>{row.fo}</td>
                    <td>{row.fe}</td>
                    <td>{row.col1}</td>
                    <td>{row.col2}</td>
                    <td>{row.col3}</td>
                    <td>{row.c}</td>
                </tr>))}
            </tbody>
        </table>
        <Bar data={chartData}/>
        </div>
    </div>
    </>);
}

export default TP3;