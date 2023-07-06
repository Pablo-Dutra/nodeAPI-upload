const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = 'http://localhost:8080/';

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Selecione um arquivo." });
    }

    res.status(200).send({
      message: "Upload realizado com sucesso: " + req.file.originalname,
    });
  } catch (err) {
    res.status(500).send({
      message: `Não foi possível fazer o upload do arquivo: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Não foram encontrados arquivos.",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + "files/" + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Não foi possível baixar o arquivo. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};