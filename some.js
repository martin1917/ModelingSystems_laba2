const divCharts = document.getElementById("chartsForStep")
const btn = document.getElementById("btnCalc")

btn.addEventListener("click", (e) => {
    calc()
})

let calc = () => {
    divCharts.innerHTML = ""

    let h = 1.0
    let index = 0 
    let res = start(h)
    while(true) {
        let nextRes = start(h / 2)

        let inaccuracies = []
        for(let i = 0; i < NUMBER_EQUATIONS; i++) {
            let inaccuracy = calcInaccuracy(res.values.at(-1)[i], nextRes.values.at(-1)[i])
            inaccuracies.push(inaccuracy)
        }

        const results = document.createElement("div")
        results.style.margin = "50px 0 0 0"
        results.innerHTML = generateMessage(res.values.at(-1), nextRes.values.at(-1))
        divCharts.appendChild(results)

        const charts = document.createElement("div")
        charts.id = `charts_${index}`
        charts.style.margin = "50px 0 0 0"
        divCharts.appendChild(charts)

        const canvasIds = Array.from(Array(NUMBER_EQUATIONS).keys()).map((_, i) => `${index}_canvas_${i}`)
        createCanvases(charts.id, canvasIds, `h = ${h}`)
        drawCharts(canvasIds, res.times, res.values)

        if (inaccuracies.filter(x => x <= INACCURACY).length == NUMBER_EQUATIONS) {
            break
        }

        index++
        h /= 2
        res = nextRes
    }
}