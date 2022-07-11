import { randomInt } from 'crypto';
import React, { useState } from 'react'
import styled from 'styled-components'

const ApplicationFrame = styled.main`
max-width: 20em;
margin: 0em auto;
`

const ÜbungWähler = styled.div`
	display: flex;

	> * {
		flex-grow: 1;
	}
`
const Rechnung = styled.section`
	font-size: 200%;
`
const Ergebnis = styled.section`
display: flex;
> input {
	flex-grow: 1;
}
> span {
	font-size: 200%;
	margin-left: 1em;
}
`

const Richtig = styled.span`
	color: green;
`
const Falsch = styled.span`
	color: red;
`
const Exercises = [ 
	{ key: 'plus', label: 'Plus', }, 
	{ key: 'plus-minus', label: 'Plus-Minus', },
	{ key: 'mal', label: 'Mal', }, 
] as const;
type Exercise = (typeof Exercises)[number]['key']

const operators = [ '+', '-', '*', ]
const Ranges = [ 10, 30, 100, 1000] as const
type Range = (typeof Ranges)[number]

const Malrechnungen = [ [5, 2], [10, 2], [5, 5], [10, 5], [10, 10], [12, 12], [15, 15], [20, 20], ]

export function App() {
	const [ exercise, setExercise, ] = useState<Exercise>('plus')
	const [ range, setRange, ] = useState<Range>(30)
	const [ zahl1, setZahl1, ] = useState(Math.floor(Math.random()*range))
	const [ zahl2, setZahl2, ] = useState(Math.floor(Math.random()*(range-zahl1)))
	const [ operator, setOperator, ] = useState(0)
	const [ ergebnis, setErgebnis, ] = useState('')
	const [ richtig, setRichtig, ] = useState(0)
	const [ falsch, setFalsch, ] = useState(0)
	const [ malrechnung, setMalrechnung, ] = useState(0)

	const [ zeigeErgebnis, setZeige, ] = useState<React.ReactNode>()

	const zahlenraum = (exercise === 'plus' || exercise === 'plus-minus')?
		<select name="zahlenraum" value={range} onChange={e => { setRange(parseInt(e.target.value) as Range); neueRechnung() }}>
			{ Ranges.map(r => <option value={''+r} key={r}>{r}</option>)}
		</select>
		:
		<select name="malrechnung" value={malrechnung} onChange={e => {setMalrechnung(parseInt(e.target.value)); neueRechnung()}}>
			{ Malrechnungen.map((r, i) => <option value={i} key={i}>{r[0]} * {r[1]}</option>)}
		</select>
	
	const neueRechnung = () => {
		if(exercise === 'mal') {
			setOperator(2)
			setZahl1(Math.floor(Math.random()*(Malrechnungen[malrechnung][0]+1)))
			setZahl2(Math.floor(Math.random()*(Malrechnungen[malrechnung][1]+1)))
		} else if(exercise === 'plus-minus') {
			const op = Math.floor(Math.random()*2)
			setOperator(op)
			const z1 = Math.floor(Math.random()*range)
			setZahl1(z1)
			if(op === 0) {
				setZahl2(Math.floor(Math.random()*(range-z1)))
			} else {
				setZahl2(Math.floor(Math.random()*(z1+1)))
			}
		} else {
			setOperator(0)
			const z1 = Math.floor(Math.random()*range)
			setZahl1(z1)
			setZahl2(Math.floor(Math.random()*(range-z1)))
		}
	}
	const erwartetesErgebnis = () => {
		if(exercise === 'mal') {
			return zahl1*zahl2
		}
		if(operator === 1) {
			return zahl1-zahl2
		}
		return zahl1+zahl2
	}

	const zeigeRichtig = (erg: string) => {
		setZeige(<Richtig> = {erg}</Richtig>)
		setTimeout(() => {
			setZeige(undefined)
			neueRechnung()
		}, 1000)
	}
	const zeigeFalsch = (erg: string) => {
		setZeige(<Falsch>&ne; {erg}</Falsch>)
		setTimeout(() => {
			setZeige(undefined)
		}, 1000)
	}
	const changeErgebnis = (erg: string) => {
		if(zeigeErgebnis) return
		
		setErgebnis(erg)
		if(erg) {
			const e = parseInt(erg)

			if(e === erwartetesErgebnis()) {
				setRichtig(r => r+1)
				zeigeRichtig(erg)
				setErgebnis('')
			} else if(erg.length === (''+erwartetesErgebnis()).length) {
				setFalsch(r => r+1)
				zeigeFalsch(erg)
				setErgebnis('')
			}
		}
	}

	return <ApplicationFrame>
		<ÜbungWähler>
			<select name="exercise" value={exercise} onChange={e => { setExercise(e.target.value as Exercise); neueRechnung() }}>
				{ Exercises.map(ex => <option value={ex.key} key={ex.key}>{ex.label}</option>)}
			</select>
			{ zahlenraum }
		</ÜbungWähler>

		<Rechnung>
			{zahl1} {operators[operator]} {zahl2} {zeigeErgebnis}
		</Rechnung>

		<Ergebnis>
			<input type="number" value={ergebnis} onChange={e => changeErgebnis(e.target.value)} />
			<span><Richtig>{richtig}</Richtig> / <Falsch>{falsch}</Falsch></span>
		</Ergebnis>
	</ApplicationFrame>
}
