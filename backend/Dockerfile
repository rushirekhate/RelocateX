FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["RelocateX.API/RelocateX.API.csproj", "RelocateX.API/"]
COPY ["RelocateX.Application/RelocateX.Application.csproj", "RelocateX.Application/"]
COPY ["RelocateX.Domain/RelocateX.Domain.csproj", "RelocateX.Domain/"]
COPY ["RelocateX.Infrastructure/RelocateX.Infrastructure.csproj", "RelocateX.Infrastructure/"]

RUN dotnet restore "RelocateX.API/RelocateX.API.csproj"

COPY . .

WORKDIR "/src/RelocateX.API"

RUN dotnet publish "RelocateX.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "RelocateX.API.dll"]