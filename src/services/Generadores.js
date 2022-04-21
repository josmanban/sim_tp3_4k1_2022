class CongruencialMixto {
    
    constructor(x0,k,g,c){
        this.a = this.calcularA(k);
        this.m = this.calcularM(g);
        this.c = c;
        this.x0 = x0;
    }

    calcularA = k => {
        return 4*k+1;
    }

    calcularM = g => {
        return Math.pow(2,g);
    }

    calcularNextXi = (xi) => {
        console.log(xi);
        return (this.a*xi+this.c)%this.m;
    }

    calcularRandom = (xi) => {
        return xi/(this.m-1);
    }
    
    toString = ()=>{
        return this.a+' '+this.m+' '+this.c;
    }
}

class CongruencialMultiplicativo {
    
    constructor(x0,k,g){
        this.a = this.calcularA(k);
        this.m = this.calcularM(g);
        this.x0 = x0;
    }

    calcularA = k => {
        return 8*k+3;
    }

    calcularM = g => {
        return Math.pow(2,g);
    }

    calcularNextXi = (xi) => {
        return (this.a*xi)%this.m;
    }

    calcularRandom = (xi) => {
        return xi/(this.m-1);
    }

    toString = ()=>{
        return this.a+' '+this.m;
    }
    
}

class Uniforme {
    constructor(a,b,k){
        this.a=a;
        this.b=b;
        this.k=k;
    }

    calcularRandom = ()=>{
        return parseFloat((this.a+Math.random()*(this.b-this.a)).toFixed(4));
    }

    getMedia = ()=>{
        return parseFloat(((this.a+this.b)/2).toFixed(4));
    }

    getVarianza = ()=>{
        return parseFloat((Math.pow(this.b-this.a,2)/12).toFixed(4));
    }

    getDensidad = ()=>{
        return parseFloat((1/(this.b-this.a)).toFixed(4));
    }

    getLimites = ()=>{
        return [this.a,this.b]
    }

    getGradosLibertad = ()=>{
        return this.k-1;
    }
}

class Exponencial {
    constructor(lambda,k){
        this.lambda = lambda;
        this.k = k;
    }

    calcularRandom = ()=>{
        return parseFloat((-1/this.lambda)*Math.log(1-Math.random()).toFixed(4));
    }

    getMedia = () => {
        return parseFloat((1/this.lambda).toFixed(4));
    }

    getVarianza = () => {
        return parseFloat((1/Math.pow(this.lambda,2)).toFixed(4));
    }

    getDensidad = (x)=> {
        return parseFloat((this.lambda*Math.pow(Math.E,(-1*this.lambda*x))).toFixed(4));
    }

    getLimites = ()=>{
        return [0,1];
    }

    getGradosLibertad = ()=>{
        return this.k-2;
    }
}

class Normal {
    constructor(media,desviacion,k){
        this.media = media;
        this.desviacion = desviacion
        this.k = k;
    }    

    getMedia = () => {
        return this.media;
    }

    getVarianza = () => {
        return parseFloat((Math.pow(this.desviacion,2)).toFixed(4));
    }

    getDensidad = (x)=> {
        return parseFloat((1/(this.desviacion*Math.sqrt(2*Math.PI)))*Math.pow(Math.E,(-0.5*Math.pow((x-this.media)/this.desviacion,2))).toFixed(4));
    }

    getLimites = (muestra)=>{
        return [Math.min(...muestra), Math.max(...muestra)]
    }

    getGradosLibertad = ()=>{
        return this.k-3;
    }

}

class NormalBoxMuller extends Normal {    

    calcularRandom = ()=>{
        if(this.convolucion){
            
        }
        const r1 = Math.random();
        const r2 = Math.random();
        const n1 = parseFloat((Math.sqrt(-2*Math.log(r1))*Math.cos(2*Math.PI*r2)*this.desviacion+this.media).toFixed(4));
        const n2 = parseFloat((Math.sqrt(-2*Math.log(r1))*Math.sin(2*Math.PI*r2)*this.desviacion+this.media).toFixed(4));
        return [n1,n2];
    }
}
class NormalConvolucion extends Normal {

    generarDatosMuestraUniforme = ()=>{
        let muestraUniforme = [];
        let sumatoriaMuestraUniforme = 0;
        for (let index = 0; index < 12; index++) {
            const numAleatorio = Math.random()
            muestraUniforme.push(numAleatorio);
            sumatoriaMuestraUniforme+= numAleatorio         
        }
        return [muestraUniforme, sumatoriaMuestraUniforme];
    }

    calcularRandom = ()=>{
        const [muestra, sumatoria] = this.generarDatosMuestraUniforme();
        return parseFloat(((sumatoria-6)*this.desviacion+this.media).toFixed(4));
    }

}
class Poisson {
    constructor(lambda,k){
        this.lambda = lambda;
        this.k = k;
    }

    calcularRandom = ()=>{
        /*
            P = 1;
            X = -1;
            A = e-λ;
            Hacer
            {
            Generar U = RND(0,1);
            P = P * U;
            X = X + 1;
            } mientras (P >= A);
            Devolver X;
        */
       let p = 1;
       let x = -1;
       let a = Math.pow(Math.E,-1*this.lambda);
       do {
        const u = Math.random();
        p = p*u;
        x = x+1;
       } while (p>=a);

       return x;
    }

    getMedia = () => {
        return parseFloat((this.lambda).toFixed(4));
    }

    getVarianza = () => {
        return parseFloat((this.lambda).toFixed(4));
    }

    getDensidad = (x)=> {
        return parseFloat(((Math.pow(this.lambda,x) * Math.pow(Math.E,-1*this.lambda))/ this.factorialize(x)).toFixed(4));
    }

    factorialize = (num) => {
        if (num === 0 || num === 1)
          return 1;
        for (var i = num - 1; i >= 1; i--) {
          num *= i;
        }
        return num;
    }

    getLimites = (muestra)=>{
       return [Math.min(...muestra), Math.max(...muestra)]
    }

    getGradosLibertad = ()=>{
        return this.k-2;
    }
}

export {
    CongruencialMixto,
    CongruencialMultiplicativo,
    Uniforme,
    Exponencial,
    NormalBoxMuller,
    NormalConvolucion,
    Poisson,
}