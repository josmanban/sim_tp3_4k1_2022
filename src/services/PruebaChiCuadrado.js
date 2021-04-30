class PruebaChiCuadrado{
    constructor(numIntervalos, muestra, generador ,confianza=0.95){
        this.numIntervalos=numIntervalos;
        this.muestra = muestra;
        this.confianza = confianza;
        this.generador = generador;
        this.data = [];
    }

    generarIntervalos = () => {
        if (!this.generador && this.muestra.length>0){
            const paso = 1/this.numIntervalos;
            for(let i=0;i<this.numIntervalos;i++){
                const min = parseFloat((i*paso).toFixed(4));
                const max = parseFloat(((i+1)*paso).toFixed(4));
                const mc = parseFloat(((min+max)/2).toFixed(4));
                this.data.push({
                    min,
                    max,
                    mc,
                })
            }
        } else if(this.generador && this.muestra.length){
            const [minLimite,maxLimite] = this.generador.getLimites(this.muestra);
            const paso = (maxLimite-minLimite)/this.numIntervalos;
            for(let i=0;i<this.numIntervalos;i++){
                let min = null;
                if (i===0) {
                    min = parseFloat((minLimite).toFixed(4));
                } else {
                    min = this.data[i-1].max;
                }
                const max = parseFloat((min+paso).toFixed(4));
                const mc = parseFloat(((min+max)/2).toFixed(4));
                this.data.push({
                    min,
                    max,
                    mc,
                })
            }
        } else {
            this.data = [];
        }
    }

    contarFrecuenciaMuestra = (min,max) => {
        let counter = 0;
        for(let i=0;i<this.muestra.length;i++){
            if(this.muestra[i]>=min && this.muestra[i]<max){
                counter+=1;
            }
        }
        return counter;
    }

    calcularFrecuenciaEsperada = (x,intervaloLength)=>{
        if (this.generador) {
            return parseFloat((this.generador.getDensidad(x)*intervaloLength*this.muestra.length).toFixed(4));
        }
        return parseFloat((this.muestra.length/this.numIntervalos).toFixed(4));
    }

    calcularColumnas = () => {
        this.data.forEach((row,i)=>{
            const fo = this.contarFrecuenciaMuestra(row.min,row.max);
            const fe = this.calcularFrecuenciaEsperada(row.mc, row.max-row.min);
            const aux1 = parseFloat((fo-fe).toFixed(4));
            const aux2 = parseFloat((Math.pow(aux1,2)).toFixed(4));
            const aux3 = fe!=0?parseFloat((aux2/fe).toFixed(4)):0;
            const c = i == 0 ? aux3 : parseFloat((this.data[i-1].c+aux3).toFixed(4));
            row['fo']= fo;
            row['fe'] = fe;
            row['col1'] = aux1;
            row['col2'] = aux2;
            row['col3'] = aux3;
            row['c'] = c;
        });
    }

    getGradosDeLibertad = ()=>{
        return this.numIntervalos-1;
    }

    calcularChiCuadrado = ()=>{
        this.generarIntervalos();
        this.calcularColumnas();
    }

    verificarChiCuadrado = () => {
        return {};
    }  

}

export {PruebaChiCuadrado}