import RedTempleSVG from '/src/assets/images/illustrations/red-temple-winter.svg';
import { StyledRedTempleContainer } from '../../styles/About/AboutBackground/StyledRedTempleContainer';
import { StyledAboutSection } from '../../styles/About/AboutLayout/StyledAboutLayout';
import { StyledAboutTextContainer } from '../../styles/About/AboutText/StyledAboutTextContainer';
import {
  picturesTextVariants,
  redTempleVariants,
} from '../../utils/animations';
import { useReducedMotion } from 'framer-motion';
import { StyledSectionHeading } from '../../styles/UI/StyledSectionHeading';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useGlobalContext } from '../../Context/Context';

const About = () => {
  const { t } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const { theme } = useGlobalContext();
  const shouldReduceMotion = useReducedMotion();
  return (
    <>
      <StyledAboutSection pageTheme={theme}>
        <StyledSectionHeading lang={lang}>
          <h2 id='about'> {t('about-heading')}</h2>
        </StyledSectionHeading>
        <StyledAboutTextContainer
          initial={shouldReduceMotion ? 'noMotion' : 'hidden'}
          whileInView='visible'
          viewport={{ once: true }}
          variants={picturesTextVariants}
        >
          <p>{t('about-text-1')}</p>
          <p>{t('about-text-2')}</p>
          <p>{t('about-text-3')}</p>
          <p>{t('about-text-4')}</p>
        </StyledAboutTextContainer>
        <StyledRedTempleContainer
          initial={shouldReduceMotion ? 'noMotion' : 'hidden'}
          whileInView='visible'
          viewport={{ once: true }}
          variants={redTempleVariants}
        >
          <RedTempleSVG />
        </StyledRedTempleContainer>
      </StyledAboutSection>
    </>
  );
};

export default About;
