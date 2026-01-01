public class Settlement {

    // Example function to integrate (toy settlement curve)
    static double f(double x) {
        return Math.exp(-x) * Math.sin(x);
    }

    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Expected 1 argument: n");
            System.exit(1);
        }

        int n = Integer.parseInt(args[0]);
        if (n % 2 != 0) n++; // Simpson requires even n

        double a = 0.0;
        double b = 10.0;
        double h = (b - a) / n;

        double sum = f(a) + f(b);

        for (int i = 1; i < n; i++) {
            double x = a + i * h;
            sum += (i % 2 == 0 ? 2 : 4) * f(x);
        }

        double result = sum * h / 3.0;

        // IMPORTANT: print only ONE number
        System.out.println(result);
    }
}
