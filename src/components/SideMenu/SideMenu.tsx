import styled from 'styled-components';
import projectIcon from '../../assets/icons/project-icon.svg';
import chestIcon from '../../assets/icons/chest-icon.svg';
import heartIcon from '../../assets/icons/heart-icon.svg';
import sygmaIcon from '../../assets/icons/sygma.svg';

export function SideMenu(): JSX.Element {
  return (
    <SidebarWrapper>
      <ProjectIconWrapper href={'#'}>
        <ProjectIcon src={projectIcon} alt="project icon" />
        <ProjectName>Testnet Validator Launchpad</ProjectName>
      </ProjectIconWrapper>
      <nav>
        <MenuItem href={'#'}>
          <img src={chestIcon} alt="chest icon" />
          Home
        </MenuItem>
        <MenuItem href={'#'}>
          <img src={heartIcon} alt="FAQ" />
          FAQ
        </MenuItem>
      </nav>
      <PoweredBySygmaLogo className="sygma" src={sygmaIcon} alt="powered by sygma" />
    </SidebarWrapper>
  );
}

const SidebarWrapper = styled.div`
  padding: 13px 0 0 15px;
  background: var(--blue-900);
`;

const ProjectIconWrapper = styled.a`
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 31px;
`;

const ProjectIcon = styled.img`
  max-width: 59px;
  max-height: 59px;
`;

const ProjectName = styled.div`
  color: var(--white);
  align-self: center;
  word-spacing: 100vw;
  margin-left: 2px;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 0.8125rem;
`;

const MenuItem = styled.a`
  cursor: pointer;
  padding: 8px 16px;
  max-width: 120px;
  color: var(--grey-400);
  display: flex;
  background: var(--blue-700);
  border-radius: 12px;
  margin-bottom: 8px;

  img {
    max-width: 22px;
    width: 100%;
    margin-right: 11px;
  }
`;

const PoweredBySygmaLogo = styled.img`
  position: absolute;
  margin-bottom: 38px;
  margin-left: 17px;
  bottom: 0;
`;
