package org.sdproject.api.email;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.sdproject.api.Api;

import java.util.Date;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;

public class EmailSender {
    private static final Properties PROPERTIES = new Properties();
    private static final String EMAIL = Api.DOTENV.get("EMAIL");
    private static final String PASSWORD = Api.DOTENV.get("EMAIL_PASSWORD");
    private static final Session SESSION;
    private static final AtomicLong EMAIL_COUNTER = new AtomicLong(1);

    static {
        PROPERTIES.put("mail.smtp.host", "smtp.gmail.com");
        PROPERTIES.put("mail.smtp.port", "587");
        PROPERTIES.put("mail.smtp.auth", true);
        PROPERTIES.put("mail.smtp.starttls.enable", true);

        SESSION = Session.getInstance(PROPERTIES, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(EMAIL, PASSWORD);
            }
        });
    }

    @SuppressWarnings("CallToPrintStackTrace")
    public static void send(String to, String subject, String message) {
        final ExecutorService executorService = Executors.newSingleThreadExecutor();
        final CompletableFuture<Long> promise = CompletableFuture.supplyAsync(() -> {
            final long id = EMAIL_COUNTER.getAndIncrement();

            try {
                final MimeMessage mimeMessage = new MimeMessage(SESSION);
                mimeMessage.setFrom(new InternetAddress(EMAIL));
                mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
                mimeMessage.setSubject(subject);
                mimeMessage.setSentDate(new Date());
                mimeMessage.setText(message);

                System.out.println("Sending email (id " + id + ") to " + to);
                Transport.send(mimeMessage);
            } catch (MessagingException mex) {
                mex.printStackTrace();

                final Exception ex = mex.getNextException();
                if (ex != null) {
                    ex.printStackTrace();
                }
            }

            return id;
        }, executorService);

        promise.thenAccept(id -> System.out.println("Sent email (id " + id + ") to " + to));

        executorService.shutdown();
    }
}
