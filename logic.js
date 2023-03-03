// Значения постоянных параметров модели
const PARAMS = {
    k: 1,
    l: 8,
    m: 2,
    n: 7,
    k1: 90,
    b: 25000,
    i1: 10,
    i2: 2,
    s: 200,
    V: 800,
    T: 12,
    deltaMax: 0.5
}

// допустимая погрешность
const INACCURACY = 0.01

// кол-во уравнений
const NUMBER_EQUATIONS = 5

// расчет относительной погрешности
const calcInaccuracy = (y, y1) => Math.abs((y1 - y) / y1)

// главная ф-ция
const start = (h) => {
    const times = [0.0]
    const values = [[0.3, 0.3, 0, 0, 500]]
    const deltaValues = [values[0][3]]
    
    const f0 = (t, j) => PARAMS.k * values[j][1] - PARAMS.k * values[j][0]

    const f1 = (t, j) => values[j][2]

    const f2 = (t, j) => PARAMS.l * values[j][0] 
                        - PARAMS.l * values[j][1] 
                        - PARAMS.m * values[j][2] 
                        + PARAMS.n * values[j][3]

    const f3 = (nextDelta) => Math.abs(nextDelta) <= PARAMS.deltaMax 
        ? nextDelta 
        : PARAMS.deltaMax * Math.sign(nextDelta)

    const f4 = (t, j) => PARAMS.V * Math.sin(values[j][0])

    const omega = (t, j) => (10000 - values[j][4]) / (PARAMS.b - PARAMS.V * t)
    const delta = (t, j) => -PARAMS.k1 * values[j][3] 
                            - PARAMS.i1 * values[j][1] 
                            - PARAMS.i2 * values[j][2] 
                            + PARAMS.s * (omega(t, j) - values[j][1])

    const eulerMethod = (prevValue, prevStep, f, t) => {
        return prevValue + f(t, prevStep) * h
    }

    const solve = (nextStep, t) => {
        let newValues = []
        let prevStep = nextStep - 1
    
        newValues.push(eulerMethod(values[prevStep][0], prevStep, f0, t))
        newValues.push(eulerMethod(values[prevStep][1], prevStep, f1, t))
        newValues.push(eulerMethod(values[prevStep][2], prevStep, f2, t))
    
        let nextDelta = eulerMethod(deltaValues[prevStep], prevStep, delta, t)
        deltaValues.push(nextDelta)
    
        newValues.push(f3(nextDelta))
        newValues.push(eulerMethod(values[prevStep][4], prevStep, f4, t))
    
        return newValues
    }

    let t = 0.0
    let j = 0
    while (t < PARAMS.T) {
        t += h
        j += 1
        let nextValues = solve(j, t);
        times.push(t)
        values.push(nextValues)
    }

    return {
        times, values
    }
}