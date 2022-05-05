class PruebaKS{
    constructor(numIntervalos, muestra, generador ,confianza=0.95){
        this.numIntervalos=numIntervalos;
        this.muestra = muestra;
        this.confianza = confianza;
        this.generador = generador;
        this.data = [];
    }

    calcularsKS = () => {
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
                });
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
        const fe = Math.abs(this.calcularFrecuenciaEsperada(mc,max-min));
        const pfo = parseFloat((fo/this.muestra.length).toFixed(4));
        const pfe = parseFloat((fe/this.muestra.length).toFixed(4));
        const pfo_ac= parseFloat((pfo+ (i>0 ? this.data[i-1].pfo_ac : 0)).toFixed(4));
        const pfe_ac = parseFloat((pfe+ (i>0 ? this.data[i-1].pfe_ac : 0)).toFixed(4));
        const resta_probabilidades_acumuladas = parseFloat((Math.abs(pfo_ac-pfe_ac)).toFixed(4));
        const maximo_resta = i==0 || resta_probabilidades_acumuladas > this.data[i-1].maximo_resta ? resta_probabilidades_acumuladas:this.data[i-1].maximo_resta;
        return {fo,fe,pfo,pfe,pfo_ac,pfe_ac,resta_probabilidades_acumuladas,maximo_resta}
    }

    getGradosDeLibertad = ()=>{
        return this.numIntervalos-1;
    }

    verificarChiCuadrado = () => {
        return {};
    }  

}

export {PruebaKS}