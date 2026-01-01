public class Energy_Calculator {
    public static void main(String[] args) {
        double mass = Double.parseDouble(args[0]);
        double c = 299_792_458;
        System.out.println(mass * c * c);
    }
}
