import './SideMenu.scss';
import { Spinner } from '../Spinner';
import { Checkmark, Failure } from '../icons';
import { Heading } from '../Heading';

export function SideMenu(): JSX.Element {
  return (
    <div className="sidebar">
      <menu>
        <Heading>Logo</Heading>
        <Spinner />
        <Checkmark />
        <Failure />
        <Heading>Logo</Heading>
      </menu>
    </div>
  );
}
