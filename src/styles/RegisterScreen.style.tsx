import { StyleSheet } from 'react-native';

export const RegisterStyle = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: '#007bff',
    textAlign: 'center',
  },
  summaryBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 3,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },

  switchText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007bff',
    fontWeight: 'bold',
  },
});
