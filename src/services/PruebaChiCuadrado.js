class PruebaChiCuadrado{
    constructor(numIntervalos, muestra, generador ,confianza=0.95){
        this.numIntervalos=numIntervalos;
        this.muestra = muestra;
        this.confianza = confianza;
        this.generador = generador;
        this.data = [];
    }

    calcularChiCuadrado = () => {
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
                    ...this.calcularColumnas(max,min,mc,i)
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
                    ...this.calcularColumnas(max,min,mc,i)
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
            const densidad = this.generador.getDensidad(x);
            return parseFloat((densidad*intervaloLength*this.muestra.length).toFixed(4));
        }
        return parseFloat((this.muestra.length/this.numIntervalos).toFixed(4));
    }

    calcularColumnas = (max,min,mc,i) => {        
        const fo = this.contarFrecuenciaMuestra(min,max);
        const fe = this.calcularFrecuenciaEsperada(mc,max-min);
        const col1 = parseFloat((fo-fe).toFixed(4));
        const col2 = parseFloat((Math.pow(col1,2)).toFixed(4));
        const col3 = fe!=0?parseFloat((col2/fe).toFixed(4)):0;
        const c = i == 0 ? col3 : parseFloat((this.data[i-1].c+col3).toFixed(4));
        return {fo,fe,col1,col2,col3,c}
    }

    getGradosDeLibertad = ()=>{
        return this.numIntervalos-1;
    }

    verificarChiCuadrado = () => {
        return {};
    }  

}

export {PruebaChiCuadrado}