/**
 * создание канвасов для последющей отрисовки
 * @param {string} chartId - id блока, в котором расположаться графики
 * @param {string[]} canvasIds - массив id'шников, с которыми создадуться canvas'ы
 * @param {string} message - доп. сообщение, выводящееся перед выводом графиков
 */
const createCanvases = (chartId, canvasIds, message) => {
    let divCharts = document.getElementById(chartId)
    
    divCharts.innerHTML = `
        <h2>Графики ф-ций ${message}</h2>
        ${canvasIds.map((id, _) => {
            return `
                <div style="margin-bottom: 50px; padding: 10px 0; text-align: "center"; border: "solid black 1px"">
                    <canvas width="1000" height="500" id="${id}"></canvas>
                </div>
            `
        }).join("\n")}
    `
}

/**
 * Отрисовка линейного графика
 * @param {Element} canvas - полотно для отрисовки
 * @param {string} fName - label
 * @param {Number[]} times - значения по оси X
 * @param {Number[]} data - значения по оси Y
 */
const addChart = (canvas, fName, times, data) => {
    new Chart(canvas, {
        type: "line",
        data: {
            labels: times,
            datasets: [
                {
                    label: fName,
                    data: data,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
			responsive: false,
            scales: {
                x: {
                    display: false
                }
            }
        }
    })
}

/**
 * отрисовка графиков для всех ф-ций
 * @param {string[]} canvasIds - массив id'шников canvas'ов
 * @param {Number[]} times - значения по оси X
 * @param {Number[][]} dataset - массив наборов значений по оси Y
 */
const drawCharts = (canvasIds, times, dataset) => {
    for(let i = 0; i < canvasIds.length; i++) {
        let canvas = document.getElementById(`${canvasIds[i]}`)
    
        let data = []
        for(let j = 0; j < dataset.length; j++) {
            data.push(dataset[j][i])
        }
    
        addChart(canvas, `x${i+1}`, times.map(t => t.toFixed(2)), data)
    }
}

/**
 * Вывод информации после приближенного вычисления
 * @param {Number[]} values - значения при шаге h
 * @param {Number[]} nextValues - значения при шаге h/2
 * @returns строка с информацией
 */
let generateMessage = (values, nextValues) => {
    let mes = "<h2>Значения:</h2><br>"
    for(let i = 0; i < NUMBER_EQUATIONS; i++) {
        mes += `x${i+1}: ${values[i]} <br>`
    }

    mes += "<br><h2>Погрешность:</h2><br>"
    for(let i = 0; i < NUMBER_EQUATIONS; i++) {
        let inaccuracy = calcInaccuracy(values[i], nextValues[i])
        mes += `x${i+1}: ${(inaccuracy * 100).toFixed(4)} %<br>`
    }

    return mes
}

const btnCalcHandler = (e) => {
    let inputValue = document.getElementById("h").value.trim()
    if (inputValue.length == 0) return

    let h = inputValue - ''
    if (isNaN(h)) return

    document.getElementById("charts").innerHTML = ""

    // значения при шаге = h
    let res = start(h)
    
    // значения при шаге = h/2
    let nextRes = start(h / 2)

    const canvasIds = Array.from(Array(NUMBER_EQUATIONS).keys()).map((_, i) => `canvas_${i}`)
    createCanvases("charts", canvasIds, `h = ${h}`)
    drawCharts(canvasIds, res.times, res.values)
    document.getElementById("results").innerHTML = generateMessage(res.values.at(-1), nextRes.values.at(-1))
}

const btnCalc = document.getElementById("calc")
btnCalc.addEventListener("click", btnCalcHandler)