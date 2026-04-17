/**
 * Middleware de gestion des erreurs
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || "Erreur serveur interne";

  res.status(status).json({
    error: message,
    status: status,
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
