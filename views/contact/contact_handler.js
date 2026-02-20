/**
 * L'ÉPICERIE - Contact Form Handler via EmailJS con SweetAlert2
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización con tu Public Key real
    emailjs.init("iUrH34XnMhnZcFrmz");

    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Selección precisa de campos
            const nameField = contactForm.querySelector('input[type="text"]');
            const emailField = contactForm.querySelector('input[type="email"]');
            const subjectField = contactForm.querySelector('select');
            const messageField = contactForm.querySelector('textarea');
            const submitBtn = contactForm.querySelector('button');

            // 2. Validación de campos vacíos
            if (!nameField.value.trim() || !emailField.value.trim() || !messageField.value.trim()) {
                Swal.fire({
                    title: 'Campos Incompletos',
                    text: 'Por favor, complete todos los campos para continuar.',
                    icon: 'warning',
                    confirmButtonColor: '#1b2e26'
                });
                return;
            }

            // 3. Estado de carga en el botón
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>ENVIANDO...</span>';
            submitBtn.disabled = true;

            // 4. Parámetros EXACTOS para tu plantilla HTML
            const templateParams = {
                from_name: nameField.value.trim(),  // Rellena {{from_name}}
                from_email: emailField.value.trim(), // Rellena {{from_email}}
                subject: subjectField.value,        // Rellena {{subject}}
                message: messageField.value.trim()   // Rellena {{message}}
            };

            // 5. Envío mediante EmailJS
            emailjs.send('service_weiei7r', 'template_pa2sncr', templateParams)
                .then(() => {
                    Swal.fire({
                        title: '¡Mensaje Enviado!',
                        text: 'Nuestro concierge ha recibido su solicitud con éxito.',
                        icon: 'success',
                        confirmButtonColor: '#1b2e26',
                        iconColor: '#c5a47e'
                    });
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('Error de EmailJS:', error);
                    Swal.fire({
                        title: 'Error de Envío',
                        text: 'Hubo un problema al procesar su mensaje. Intente de nuevo.',
                        icon: 'error',
                        confirmButtonColor: '#1b2e26'
                    });
                })
                .finally(() => {
                    // Restaurar botón
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});