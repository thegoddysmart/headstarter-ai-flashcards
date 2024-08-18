import { Box, Typography, IconButton, Link } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#1e1e1f',
  color: '#fff',
  textAlign: 'center',
}));

const SocialIconsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  margin: theme.spacing(1, 0),
}));

const FooterText = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  margin: theme.spacing(0.5, 0),
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  margin: theme.spacing(1, 0),
}));

export default function Footer() {
  return (
    <FooterContainer>
      <FooterHeading>Follow Us On:</FooterHeading>
      <SocialIconsContainer>
        <IconButton component={Link} href="https://twitter.com" color="inherit">
          <TwitterIcon />
        </IconButton>
        <IconButton component={Link} href="https://facebook.com" color="inherit">
          <FacebookIcon />
        </IconButton>
        <IconButton component={Link} href="https://instagram.com" color="inherit">
          <InstagramIcon />
        </IconButton>
        <IconButton component={Link} href="https://gmail.com" color="inherit">
          <MailIcon />
        </IconButton>
      </SocialIconsContainer>
      <FooterText>&copy; 2024 Recall IQ FlashCards</FooterText>
      <FooterText>Proudly Ghanaian ❤️</FooterText>
    </FooterContainer>
  );
}
