FROM node:18-alpine as node
WORKDIR /src

ARG FONTAWESOME_TOKEN


# Copy everything else and build
COPY ./Automatica.WebNew /src

RUN ls -lah /src

RUN npm install
RUN npm run build-docker


FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

RUN apt-get update 
RUN apt-get install zip net-tools -y

ARG VERSION
ARG CLOUD_API_KEY
ARG CLOUD_URL

#install automatica-cli
RUN dotnet tool install --global automatica-cli
ENV PATH="${PATH}:/root/.dotnet/tools"

# Copy everything else and build
COPY . /src

COPY --from=node /src/dist /app/automatica/wwwroot

RUN dotnet test /src/

RUN automatica-cli setversion $VERSION -W /src/
RUN dotnet publish -c Release -o /app/automatica /src/ -r linux-x64 --self-contained

COPY ./Automatica.Core/appsettings.json /app/automatica/appsettings.json
RUN echo docker has some strange errors sometimes
COPY ./Automatica.Core/appsettings.json .

RUN mkdir -p /app/plugins
RUN echo $VERSION
RUN automatica-cli InstallLatestPlugins -I /app/plugins -M $VERSION -A $CLOUD_API_KEY -C  $CLOUD_URL


RUN rm -rf /src

FROM automaticacore/automatica-plugin-runtime:amd64-7 AS runtime
WORKDIR /app/

COPY --from=build /app/ ./

VOLUME /app/plugins
EXPOSE 1883/tcp
EXPOSE 5001/tcp	
ENV AUTOMATICA_PLUGIN_DIR=/app/plugins

# Build runtime image
ENTRYPOINT ["/app/automatica/Automatica.Core.Watchdog"]