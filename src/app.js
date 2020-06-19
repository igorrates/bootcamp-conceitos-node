const express = require("express");
const cors = require("cors");
const validUrl = require('valid-url');
const {
  uuid,
  isUuid
} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {
    title,
    url,
    techs
  } = request.body;

  if (!validUrl.isUri(url)) {
    return response.status(400).json({
      error: "Not a valid url"
    });
  }

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepository);
  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const {
    id
  } = request.params;
  const {
    title,
    url,
    techs,
    likes
  } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({
      error: "Repository not found!"
    });
  }

  if (likes) {
    return response.json({
      likes: 0
    });
  }

  if (!validUrl.isUri(url)) {
    return response.status(400).json({
      error: "Not a valid url"
    });
  }

  const repToUpdate = repositories[repositoryIndex];

  repToUpdate.title = title;
  repToUpdate.url = url;
  repToUpdate.techs = techs;

  repositories[repositoryIndex] = repToUpdate;

  return response.json(repToUpdate);
});

app.delete("/repositories/:id", (request, response) => {
  const {
    id
  } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({
      error: "Repository not found!"
    });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {
    id
  } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({
      error: "Repository not found!"
    });
  }

  const repToUpdate = repositories[repositoryIndex];

  repToUpdate.likes = repToUpdate.likes + 1;

  repositories[repositoryIndex] = repToUpdate;

  return response.json(repToUpdate);
});

module.exports = app;