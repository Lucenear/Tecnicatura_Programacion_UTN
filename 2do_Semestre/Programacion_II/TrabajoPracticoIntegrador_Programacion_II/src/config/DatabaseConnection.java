package config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private String url;
    private String username;
    private String password;

    // Constructor que recibe el puerto como parametro
    public DatabaseConnection(String dbName, String user, String pass, int port) {
        this.url = "jdbc:mysql://localhost:" + port + "/" + dbName + "?useSSL=false&serverTimezone=UTC";
        this.username = user;
        this.password = pass;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }
}