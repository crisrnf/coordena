
const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());


// Configuración de MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'tu_contraseña_mysql',
  database: 'nombre_base_de_datos'
};

// Configuración de Nodemailer (email)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu_email@gmail.com',
    pass: 'tu_contraseña'
  }
});


// Función simulada para enviar notificación push
function sendPushNotification(token, title, body) {
  // Simulación: solo imprime en consola
  console.log(`Push enviado a ${token}: ${title} - ${body}`);
}

// Función para enviar email
function sendEmail(to, subject, text) {
  return transporter.sendMail({
    from: 'tu_email@gmail.com',
    to,
    subject,
    text
  });
}

// Función para enviar SMS simulado
function sendSMS(phone, message) {
  // Simulación: solo imprime en consola
  console.log(`SMS enviado a ${phone}: ${message}`);
}


// RF-21: Docente marca lista, notifica ausentes y presentes usando MySQL
app.post('/marcar-lista', async (req, res) => {
  const { cocinaToken, docenteToken, docenteEmail, curso_id } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Obtener presentes y ausentes desde la base de datos
    const [presentesRows] = await connection.execute(
      'SELECT nombre FROM alumnos WHERE curso_id = ? AND presente = 1',
      [curso_id]
    );
    const [ausentesRows] = await connection.execute(
      'SELECT nombre FROM alumnos WHERE curso_id = ? AND presente = 0',
      [curso_id]
    );

    const presentes = presentesRows.map(row => row.nombre);
    const ausentes = ausentesRows.map(row => row.nombre);

    // Notificar a cocina los presentes (push)
    if (presentes.length && cocinaToken) {
      const bodyPresentes = `Alumnos presentes: ${presentes.join(', ')}`;
      sendPushNotification(cocinaToken, 'Presentes en ciclo', bodyPresentes);
    }

    // Notificar al docente los ausentes (push y email opcional)
    if (ausentes.length && docenteToken) {
      const bodyAusentes = `Alumnos ausentes: ${ausentes.join(', ')}`;
      sendPushNotification(docenteToken, 'Ausentes en tu curso', bodyAusentes);
      if (docenteEmail) await sendEmail(docenteEmail, 'Ausentes en tu curso', bodyAusentes);
    }

    // RF-22: SMS en caso de ausencia masiva
    if (ausentes.length > 10) {
      sendSMS('telefono_directivo', `Alerta: Ausencia masiva (${ausentes.length} alumnos)`);
      await sendEmail('directivo@email.com', 'Alerta de ausencia masiva', `Ausentes: ${ausentes.join(', ')}`);
    }

    await connection.end();
    res.send('Lista procesada y notificaciones enviadas');
  } catch (err) {
    res.status(500).send('Error enviando notificaciones');
  }
});

// RF-23: Alerta de inicio de sesión sospechoso
app.post('/alerta-sesion-sospechosa', async (req, res) => {
  const { userToken, userEmail, location } = req.body;
  const body = `Se detectó un inicio de sesión sospechoso desde: ${location}`;
  try {
    await sendPushNotification(userToken, 'Alerta de seguridad', body);
    await sendEmail(userEmail, 'Alerta de seguridad', body);
    res.send('Alerta de seguridad enviada');
  } catch (err) {
    res.status(500).send('Error enviando alerta de seguridad');
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en puerto 3000');
});