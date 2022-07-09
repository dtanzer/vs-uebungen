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

const Exercises = [ 
	{ key: 'plus', label: 'Plus', }, 
	{ key: 'plus-minus', label: 'Plus-Minus', },
	{ key: 'mal', label: 'Mal', }, 
] as const;
type Exercise = (typeof Exercises)[number]['key']

const Ranges = [ 10, 30, 100, 1000] as const
type Range = (typeof Ranges)[number]
export function App() {
	const [ exercise, setExercise, ] = useState<Exercise>('plus')
	const [ range, setRange, ] = useState<Range>(30)
	const [ zahl1, setZahl1, ] = useState(Math.floor(Math.random()*range))
	const [ zahl2, setZahl2, ] = useState(Math.floor(Math.random()*(range-zahl1)))
	const [ operator, setOperator, ] = useState(Math.floor(Math.random()*2))
	const [ ergebnis, setErgebnis, ] = useState('')
	const [ richtig, setRichtig, ] = useState(0)

	const zahlenraum = (exercise === 'plus' || exercise === 'plus-minus')?
		<select name="zahlenraum" value={range} onChange={e => setRange(parseInt(e.target.value) as Range)}>
			{ Ranges.map(r => <option value={''+r} key={r}>{r}</option>)}
		</select>
		:undefined
	
	const changeErgebnis = (erg: string) => {
		if(erg) {
			const e = parseInt(erg)
			setErgebnis(erg)
			if(e === zahl1+zahl2) {
				const z1 = Math.floor(Math.random()*range)
				setZahl1(z1)
				setZahl2(Math.floor(Math.random()*(range-z1)))
				setRichtig(r => r+1)
				setErgebnis('')
			}
		}
	}

	return <ApplicationFrame>
		<ÜbungWähler>
			<select name="exercise" value={exercise} onChange={e => setExercise(e.target.value as Exercise)}>
				{ Exercises.map(ex => <option value={ex.key} key={ex.key}>{ex.label}</option>)}
			</select>
			{ zahlenraum }
		</ÜbungWähler>

		<Rechnung>
			{zahl1} + {zahl2}
		</Rechnung>

		<Ergebnis>
			<input type="number" value={ergebnis} onChange={e => changeErgebnis(e.target.value)} />
			<span>{richtig}</span>
		</Ergebnis>
	</ApplicationFrame>
}
