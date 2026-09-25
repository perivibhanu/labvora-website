import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloat() {
    return (
        <a
            href="https://wa.me/917032055712"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp size={28} color="white" />
        </a>
    );
}
