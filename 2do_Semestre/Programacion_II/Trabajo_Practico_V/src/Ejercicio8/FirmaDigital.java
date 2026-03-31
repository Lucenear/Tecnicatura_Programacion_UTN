package Ejercicio8;

public class FirmaDigital {
    private String codigoHash;
    private String fecha;

    public FirmaDigital(String codigoHash, String fecha) {
        this.codigoHash = codigoHash;
        this.fecha = fecha;
    }

    public String getCodigoHash() { return codigoHash; }
    public String getFecha() { return fecha; }
}