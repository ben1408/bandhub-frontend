import './ContactUs.css';
import { Paper, Typography, Box, Stack } from '@mui/material';

export const ContactUs = () => {
    return (
        <Paper elevation={8} className="contact-footer" sx={{ bgcolor: '#1E1E1E', color: '#F5F5F5', width: '75%', borderRadius: 4, mt: 8, mb: 12, paddingTop: 8, paddingBottom: 7, paddingLeft: 7, paddingRight: 6 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start" justifyContent="space-between">
                <Box flex={1}>
                    <Typography variant="h5" fontWeight={700} color="white" marginBottom={5} marginTop={0.6} gutterBottom>
                        Contact Us
                    </Typography>
                    <Typography variant="body1" color="#F5F5F5" sx={{ mb: 5 }}>
                        Have questions, feedback, or want to work with Imprint Records? Reach out and our team will get back to you soon.
                    </Typography>
                    <Typography variant="body2" color="#F5F5F5" fontSize={18}>
                        Email: <a href="mailto:info@imprintrecords.com" style={{ color: '#bfc9d1', textDecoration: 'none', fontSize: '16px' }}>info@imprintrecords.com</a><br />
                        Phone: <a href="tel:+1234567890" style={{ color: '#bfc9d1', textDecoration: 'none', fontSize: '16px' }}>+1 (234) 567-890</a><br />
                        Address: 1234 Music Ave, Suite 100, Los Angeles, CA
                    </Typography>
                </Box>
                <Box flex={1} sx={{ mt: { xs: 3, md: 0 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Paper elevation={4} sx={{ bgcolor: '#2a2a2aff', borderLeft: '2px solid white', p: 3, width: '100%', maxWidth: 420, }}>
                        <Typography variant="body1" color="#F5F5F5" sx={{ fontStyle: 'italic', fontSize: '1.13rem', lineHeight: 1.7, textAlign: 'left' }}>
                            Are you a band looking to join our label?
                            <br /><br />
                            <span style={{ color: '#bfc9d1', fontWeight: 600 }}>
                                Send us an email at <a href="mailto:info@imprintrecords.com" style={{ color: '#bfc9d1', textDecoration: 'underline', fontWeight: 600 }}>info@imprintrecords.com</a>
                            </span>
                            <br />
                            with your band details, links to your music, and a short introduction.
                            <br /><br />
                            <span style={{ color: '#bfc9d1', fontWeight: 500 }}>
                                Our team reviews every submission and will reach out if there’s a fit.
                                <br /><br />
                                We look forward to hearing from you!
                            </span>
                        </Typography>
                    </Paper>
                </Box>
            </Stack>
        </Paper>
    );
}