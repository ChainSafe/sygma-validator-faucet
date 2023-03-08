import { Fragment } from 'react';
import {useMatch} from 'react-router-dom';
import { Step as StepType } from '../../types';
import './Steps.css';

interface Props {
  steps: StepType[];
}
export function Steps({ steps }: Props): JSX.Element {
  return (
    <div className="steps-container">
      {' '}
      {steps.map((step, index) => (
        <Fragment key={step.route}>
          <Step {...step}/>
          {index !== steps.length - 1 && <b>{' > '}</b>}
        </Fragment>
      ))}{' '}
    </div>
  );
}

function Step({name, route}: StepType): JSX.Element {
  const match = !!useMatch(route);
  return (
    <div className={match ? 'active' : ''}>
      {name}
    </div>
    );

}
