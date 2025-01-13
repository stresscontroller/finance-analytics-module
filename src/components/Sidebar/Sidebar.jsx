import { motion } from 'framer-motion';
import { StyledSidebarContainer } from '../../styles/Sidebar/StyledSidebarContainer';
import { StyledSocialList } from '../../styles/Sidebar/StyledSocialList';
import { StyledSocialLink } from '../../styles/Sidebar/StyledSocialLink';
import GithubSVG from '/src/assets/icons/github.svg';
import TelegramSVG from '/src/assets/icons/send.svg';
import MailSVG from '/src/assets/icons/mail.svg';
import { socialIconVariants, socialListVariants } from '../../utils/animations';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../../Context/Context';

const Sidebar = () => {
  const { atBottom } = useGlobalContext();

  const shouldReduceMotion = useReducedMotion();
  return (
    <StyledSidebarContainer
      atBottom={atBottom}
      initial={shouldReduceMotion ? 'noMotion' : 'hidden'}
      animate='visible'
      variants={socialListVariants}
    >
      <StyledSocialList>
        <StyledSocialLink atBottom={atBottom}>
          <motion.a
            initial='hidden'
            whileHover='visible'
            animate='hidden'
            variants={socialIconVariants}
            href='https://github.com/magician-00'
            aria-label='Github'
            target='_blank'
            rel='noreferrer noopener'
          >
            <GithubSVG />
          </motion.a>
        </StyledSocialLink>
        <StyledSocialLink atBottom={atBottom}>
          <motion.a
            initial='hidden'
            whileHover='visible'
            animate='hidden'
            variants={socialIconVariants}
            href='https://t.me/sendakiyoharu'
            aria-label='Telegram'
            target='_blank'
            rel='noreferrer noopener'
          >
            <TelegramSVG />
          </motion.a>
        </StyledSocialLink>
        <StyledSocialLink atBottom={atBottom}>
          <motion.a
            initial='hidden'
            whileHover='visible'
            animate='hidden'
            variants={socialIconVariants}
            href='mailto:senda.kiyoharu.dev@gmail.com'
            aria-label='Gmail'
            target='_blank'
            rel='noreferrer noopener'
          >
            <MailSVG />
          </motion.a>
        </StyledSocialLink>
      </StyledSocialList>
    </StyledSidebarContainer>
  );
};

export default Sidebar;
