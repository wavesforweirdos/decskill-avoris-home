import './styles/main.scss';
import { initInfoTooltips } from './components/atoms/info-tooltip/info-tooltip';
import { initHero } from './components/organisms/hero/hero';
import { initBreakdowns } from './components/molecules/trip-card/breakdown';
import { initMenu } from './components/organisms/header/menu';

initInfoTooltips();
initMenu();
initHero();
initBreakdowns();
