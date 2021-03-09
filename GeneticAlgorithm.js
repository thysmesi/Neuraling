class GeneticAlgorithm {
    constructor(options, adapter) {
        this.inputs = options.inputs
        this.outputs = options.outputs
        this.sizeOfHiddenLayer = options.sizeOfHiddenLayer
        this.numberOfHiddenLayers = options.numberOfHiddenLayers
        this.populationSize = options.populationSize
        this.mutationRate = options.mutationRate
        this.training = true

        this.adapter = adapter
        
        this.trainingData = []
        this.nets = []
        this.bestNet

        for(let i = 0; i < options.populationSize; i++) {
            this.nets.push(new NeuralNet(options.inputs, options.outputs, options.sizeOfHiddenLayer, options.numberOfHiddenLayers))
        }
    }
    select(percatage) {
        // ----- Asign Fitness to the Nets Using Adapter ----- //
        this.nets.forEach(net => {
            net.fitness = this.adapter(net, this.trainingData)
        })

        const amountKilled = this.populationSize - Math.floor(this.populationSize * percatage)
        const amountSaved = this.populationSize - amountKilled

        this.nets = this.nets.sort((a, b) => (a.fitness < b.fitness) ? 1 : -1)
        this.nets = this.nets.slice(0, amountSaved)
        
        for(let i=0; i<amountKilled; i++){
            this.nets.push(this.nets[i%amountSaved].mutate(this.mutationRate))
        }
        this.bestNet =  _.cloneDeep(this.nets[0])
    }
    start(){
        this.select(.35)

        if(this.training) setTimeout(()=>{this.start()}, 1)
    }
    stop(){
        this.training = false
    }
}

exports.GeneticAlgorithm = GeneticAlgorithm