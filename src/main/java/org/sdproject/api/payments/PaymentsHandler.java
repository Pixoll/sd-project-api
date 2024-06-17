package org.sdproject.api.payments;

import java.util.Random;

public class PaymentsHandler {
    private static final Random RANDOM = new Random();

    public static void makePayment() throws PaymentException {
        if (RANDOM.nextInt(0, 99) < 5) {
            throw new PaymentException("Error while making payment.");
        }
    }
}
