FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/NotebookLM.API/NotebookLM.API.csproj", "src/NotebookLM.API/"]
COPY ["src/NotebookLM.Application/NotebookLM.Application.csproj", "src/NotebookLM.Application/"]
COPY ["src/NotebookLM.Domain/NotebookLM.Domain.csproj", "src/NotebookLM.Domain/"]
COPY ["src/NotebookLM.Infrastructure/NotebookLM.Infrastructure.csproj", "src/NotebookLM.Infrastructure/"]
RUN dotnet restore "src/NotebookLM.API/NotebookLM.API.csproj"
COPY . .
WORKDIR "/src/src/NotebookLM.API"
RUN dotnet build "NotebookLM.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "NotebookLM.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotebookLM.API.dll"]